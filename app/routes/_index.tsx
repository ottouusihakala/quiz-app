import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Quiz App" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Quiz App</h1>
      <ul>
        <li>
          <a href="question/1">
            First question
          </a>
        </li>
      </ul>
    </div>
  );
}
