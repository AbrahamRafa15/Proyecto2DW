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
            onPublish={onPublish}
        />

        <PostBar posts={posts} />
    </div>
    );
}