import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex justify-between items-center">
     <h1>hello world!</h1>
     <Link href="/about">About</Link>
     <Link href="/contact">Contact</Link>
    </div>
  );
}
