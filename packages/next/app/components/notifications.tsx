
export function DangerNotification ({ errors }: { errors: String[] }): JSX.Element {
  return (
    <div className="notification is-danger">
      {errors && errors.map((error, index) => (
        <p key={index}>Error:{error}</p>
      ))}
    </div>
  );
}