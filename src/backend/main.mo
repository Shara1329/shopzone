import Order "mo:core/Order";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Include authorization and storage mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserRole = AccessControl.UserRole;
  public type ProductId = Nat;
  public type OrderId = Nat;
  public type ReviewId = Nat;

  public type Product = {
    id : ProductId;
    farmer : Principal;
    name : Text;
    price : Nat;
    quantity : Nat;
    description : Text;
    image : Storage.ExternalBlob;
  };

  public type OrderStatus = {
    #pending;
    #accepted;
    #delivered;
  };

  public type Order = {
    id : OrderId;
    buyer : Principal;
    product : ProductId;
    orderDate : Time.Time;
    status : OrderStatus;
  };

  public type Review = {
    id : ReviewId;
    product : ProductId;
    buyer : Principal;
    rating : Nat;
    comment : Text;
  };

  public type UserProfile = {
    role : UserRole;
    name : Text;
  };

  // Internal State
  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let reviews = Map.empty<ReviewId, Review>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId : ProductId = 1;
  var nextOrderId : OrderId = 1;
  var nextReviewId : ReviewId = 1;

  module Product {
    public func compareByPrice(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compareByQuantity(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.quantity, p2.quantity);
    };
  };

  // Helper function to check if buyer has ordered a product
  func hasBuyerOrderedProduct(buyer : Principal, productId : ProductId) : Bool {
    for (order in orders.values()) {
      if (order.buyer == buyer and order.product == productId) {
        return true;
      };
    };
    false;
  };

  // Profile Management
  public shared ({ caller }) func saveCallerUserProfile(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let role = AccessControl.getUserRole(accessControlState, caller);
    userProfiles.add(caller, { role; name });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Product Management
  public shared ({ caller }) func createProduct(
    name : Text,
    price : Nat,
    quantity : Nat,
    description : Text,
    image : Storage.ExternalBlob,
  ) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated farmers can create products");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      farmer = caller;
      name;
      price;
      quantity;
      description;
      image;
    };

    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(
    productId : ProductId,
    name : Text,
    price : Nat,
    quantity : Nat,
    description : Text,
    image : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated farmers can update products");
    };

    let existing = products.get(productId);
    switch (existing) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) {
        if (p.farmer != caller) {
          Runtime.trap("Unauthorized: You can only modify your own products");
        };
        products.add(
          productId,
          { p with name; price; quantity; description; image },
        );
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated farmers can delete products");
    };

    let existing = products.get(productId);
    switch (existing) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) {
        if (p.farmer != caller) {
          Runtime.trap("Unauthorized: You can only delete your own products");
        };
        products.remove(productId);
      };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByFarmer(farmer : Principal) : async [Product] {
    products.values().toArray().filter(func(p) { p.farmer == farmer });
  };

  public query func getProductsByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.price >= minPrice and p.price <= maxPrice }
    );
  };

  // Order Management
  public shared ({ caller }) func placeOrder(productId : ProductId) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated buyers can place orders");
    };

    // Verify product exists
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      buyer = caller;
      product = productId;
      orderDate = Time.now();
      status = #pending;
    };

    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let product = products.get(order.product);
        switch (product) {
          case (null) { Runtime.trap("Product not found") };
          case (?p) {
            // Only the farmer who owns the product can update order status
            if (caller != p.farmer) {
              Runtime.trap("Unauthorized: Only the farmer can update order status");
            };
            orders.add(orderId, { order with status = newStatus });
          };
        };
      };
    };
  };

  public query ({ caller }) func getOrdersByBuyer(buyer : Principal) : async [Order] {
    if (caller != buyer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(o) { o.buyer == buyer });
  };

  public query ({ caller }) func getOrdersByFarmer() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated farmers can view their orders");
    };

    let farmerProducts = List.empty<ProductId>();
    for (product in products.values()) {
      if (product.farmer == caller) {
        farmerProducts.add(product.id);
      };
    };

    orders.values().toArray().filter(
      func(o) {
        farmerProducts.values().contains(o.product);
      }
    );
  };

  // Review Management
  public shared ({ caller }) func createReview(
    productId : ProductId,
    rating : Nat,
    comment : Text,
  ) : async ReviewId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated buyers can create reviews");
    };

    // Verify rating is between 1 and 5
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5 stars");
    };

    // Verify product exists
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    // Verify buyer has ordered this product
    if (not hasBuyerOrderedProduct(caller, productId)) {
      Runtime.trap("Unauthorized: You can only review products you have ordered");
    };

    let reviewId = nextReviewId;
    nextReviewId += 1;

    let review : Review = {
      id = reviewId;
      product = productId;
      buyer = caller;
      rating;
      comment;
    };

    reviews.add(reviewId, review);
    reviewId;
  };

  public query func getReviewsByProduct(productId : ProductId) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.product == productId });
  };

  // Storage Operations
  public shared ({ caller }) func deleteFiles(blobIds : [Text]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete files");
    };
    // No longer delete blobs on Storage component
  };

  // Admin Dashboard Queries
  public query ({ caller }) func adminGetAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func adminGetAllProducts() : async [Product] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all products");
    };
    products.values().toArray();
  };

  public query ({ caller }) func adminGetAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all users");
    };
    userProfiles.toArray();
  };
};
