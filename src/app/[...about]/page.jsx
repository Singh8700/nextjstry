// pages/about/[...about].js

export async function generateStaticParams() {
  // Yeh aapke dynamic params ke liye data fetch karta hai
  return [
    { about: ['page1'] }, // Example, aapke routes ke hisaab se update karen
    { about: ['page2'] },
  ]
}

export default function About({ params }) {
  return (
    <div>
      <h1>About Page: {params.about.join(', ')}</h1>
    </div>
  )
}
