import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type OldPost = {
    id : Text;
    title : Text;
    content : Text;
    authorName : Text;
    publicationDate : Text;
    owner : Principal;
  };

  type OldActor = {
    posts : Map.Map<Text, OldPost>;
  };

  type Comment = {
    authorName : Text;
    content : Text;
    timestamp : Int;
  };

  type NewPost = {
    id : Text;
    title : Text;
    content : Text;
    authorName : Text;
    publicationDate : Text;
    owner : Principal;
    likes : Nat;
    comments : [Comment];
  };

  type NewActor = {
    posts : Map.Map<Text, NewPost>;
  };

  public func run(old : OldActor) : NewActor {
    let newPosts = old.posts.map<Text, OldPost, NewPost>(
      func(_id, oldPost) {
        { oldPost with likes = 0; comments = [] };
      }
    );
    { posts = newPosts };
  };
};
