import StoriesBar from "./StoriesBar";
import ThinkBar from "./ThinkBar";
import PostBar from "./PostBar";

export default function CenterFeed({
    user,
    text,
    setText,
    imageUrl,
    setImageUrl,
    canPost,
    onPublish,
    posts,
    onUpdatePost,
    onDeletePost,
    editingPostId,
    onStartEditPost,
    onCancelEdit,
    onSubmitPost,
}) {
    return (
    <div className="mx-auto" style={{ maxWidth: 680 }}>
        <StoriesBar />

        <ThinkBar
            text={text}
            setText={setText}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            canPost={canPost}
            onSubmit={onSubmitPost}
            isEditing={Boolean(editingPostId)}
            onCancelEdit={onCancelEdit}
        />

        <PostBar posts={posts} 
            user={user}
            onUpdatePost={onUpdatePost}
            onDeletePost={onDeletePost}
            onStartEditPost={onStartEditPost}
        />
    </div>
    );
}