export default function ErrorNotFound(): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Error 404</h1>
      <p>{`We couldn't find what you were looking for`}</p>
    </div>
  );
}
