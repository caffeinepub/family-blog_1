import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Comment = {
    authorName : Text;
    content : Text;
    timestamp : Int;
  };

  type Post = {
    id : Text;
    title : Text;
    content : Text;
    authorName : Text;
    publicationDate : Text;
    owner : Principal;
    likes : Nat;
    comments : [Comment];
  };

  module Post {
    public func compare(a : Post, b : Post) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  let posts = Map.empty<Text, Post>();

  func getCurrentTime() : Text {
    Time.now().toText();
  };

  func checkOwnership(owner : Principal, caller : Principal) {
    if (owner != caller) {
      Runtime.trap("You do not have permission to edit or delete this post");
    };
  };

  public shared ({ caller }) func createPost(title : Text, content : Text, authorName : Text) : async Text {
    let id = title.concat(getCurrentTime());
    let newPost : Post = {
      id;
      title;
      content;
      authorName;
      publicationDate = getCurrentTime();
      owner = caller;
      likes = 0;
      comments = [];
    };
    posts.add(id, newPost);
    id;
  };

  public shared ({ caller }) func likePost(id : Text) : async () {
    switch (posts.get(id)) {
      case (null) {
        Runtime.trap("Post does not exist");
      };
      case (?post) {
        let updatedPost : Post = {
          post with likes = post.likes + 1;
        };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func addComment(postId : Text, authorName : Text, content : Text) : async () {
    switch (posts.get(postId)) {
      case (null) {
        Runtime.trap("Post does not exist");
      };
      case (?post) {
        let newComment : Comment = {
          authorName;
          content;
          timestamp = Time.now();
        };
        let updatedComments = post.comments.concat([newComment]);
        let updatedPost : Post = {
          post with comments = updatedComments;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  public query ({ caller }) func getPost(id : Text) : async Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort(); // Implicitly uses Post.compare
  };

  public shared ({ caller }) func updatePost(id : Text, title : Text, content : Text) : async () {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) {
        checkOwnership(post.owner, caller);
        let updatedPost : Post = {
          id;
          title;
          content;
          authorName = post.authorName;
          publicationDate = post.publicationDate;
          owner = post.owner;
          likes = post.likes;
          comments = post.comments;
        };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Text) : async () {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) {
        checkOwnership(post.owner, caller);
        posts.remove(id);
      };
    };
  };
};
