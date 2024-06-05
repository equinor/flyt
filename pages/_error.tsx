export default function Error(props: { statusCode: number }) {
  const { statusCode } = props;
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({
  res,
  err,
}: {
  res: { statusCode: number };
  err: { statusCode: number };
}) => {
  let statusCode: number;
  if (res) {
    statusCode = res.statusCode;
  } else {
    statusCode = err ? err.statusCode : 404;
  }
  return { statusCode };
};
