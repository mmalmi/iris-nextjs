"use client";

import { memo, useState, useRef, useEffect } from 'react';

import PostCard from '@/components/Post/PostCard';
import NewPostForm from '@/components/NewPostForm';

import { useFeedPage } from '@/hooks';

const PAGE_SIZE = 6;
const LOAD_MORE_MARGIN = '0px 0px 1000px 0px';

const Feed = () => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const { isPostsEmpty, postEvents } = useFeedPage();
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (postEvents.length < PAGE_SIZE) {
      return;
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && displayCount < postEvents.length) {
        setDisplayCount((prevCount) => prevCount + PAGE_SIZE);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.0,
      rootMargin: LOAD_MORE_MARGIN,
    });

    const observeLastElement = () => {
      if (lastElementRef.current) {
        observer.observe(lastElementRef.current);
      }
    };

    observeLastElement(); // Observe the new last element

    return () => {
      observer.disconnect();
    };
  }, [postEvents, displayCount, lastElementRef.current]);

  if (isPostsEmpty) return <p>No Posts</p>;

  return (
    <>
      <NewPostForm />
      {postEvents
        .sort((a, b) => b.created_at - a.created_at)
        .slice(0, displayCount)
        .map((postEvent, index, self) => {
          const isLastElement = index === self.length - 1;
          return (
            <div
              key={`global${postEvent.id}${index}`}
              ref={isLastElement ? lastElementRef : null}
            >
              <PostCard postId={postEvent.id} />
            </div>
          );
        })}
    </>
  );
};

export default memo(Feed);

