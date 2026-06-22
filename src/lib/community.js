const posts = [
  {
    id: "post-1",
    author: {
      name: "Aarav Mehta",
      username: "aaravbuilds",
    },
    content:
      "<p>Just shipped the first version of my habit tracker today. It is small, a little rough, and finally <strong>real</strong>.</p><p>What are you building this week?</p>",
    createdAt: "2026-06-20T08:30:00.000Z",
    upvotes: 24,
    downvotes : 21,
    comments: 7,
  },
  {
    id: "post-2",
    author: {
      name: "Maya Kapoor",
      username: "mayamakes",
    },
    content:
      "<p>A useful reminder for anyone learning in public:</p><ul><li>Share the messy middle</li><li>Ask specific questions</li><li>Celebrate tiny wins</li></ul><p><em>Progress is more interesting than perfection.</em></p>",
    createdAt: "2026-06-19T15:10:00.000Z",
    upvotes: 41,
    downvotes : 21,
    comments: 12,
  },
  {
    id: "post-3",
    author: {
      name: "Rohan Singh",
      username: "rohan.codes",
    },
    content:
      '<p>I wrote down five things I learned while rebuilding my portfolio with React. Here are the notes: <a href="https://react.dev" target="_blank" rel="noopener noreferrer">react.dev</a>.</p><p>The biggest lesson was to make the content clear <u>before</u> polishing the animations.</p>',
    createdAt: "2026-06-18T11:45:00.000Z",
    upvotes: 18,
    downvotes : 21,
    comments: 4,
  },
  {
    id: "post-4",
    author: {
      name: "Ishita Verma",
      username: "ishita.designs",
    },
    content:
      "<p>Today&apos;s design challenge: create a dashboard using only one accent color.</p><ol><li>Start with hierarchy</li><li>Keep spacing consistent</li><li>Add color only where it carries meaning</li></ol><p>The constraint made the final screen much calmer.</p>",
    createdAt: "2026-06-17T09:20:00.000Z",
    upvotes: 33,
    downvotes : 21,
    comments: 9,
  },
  {
    id: "post-5",
    author: {
      name: "Kabir Shah",
      username: "kabirships",
    },
    content:
      "<p>Small win: I fixed a bug that had been following me for three days.</p><p><strong>Root cause:</strong> one stale state value.<br><strong>Fix:</strong> ten characters.<br><strong>Emotional damage:</strong> considerable.</p>",
    createdAt: "2026-06-16T17:05:00.000Z",
    upvotes: 57,
    downvotes : 21,
    comments: 15,
  },
];

export default function getPosts() {
  return posts;
}
// export default function addPosts(){

// }
// export function deletePosts(){
    
// }