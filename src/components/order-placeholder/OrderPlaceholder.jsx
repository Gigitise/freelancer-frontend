const OrderPlaceholder = ({ message, icon }) => {
  return (
    <div className="create-task-div">
      <div className="child">
        <article>{message}</article>
      </div>
    </div>
  );
};

export default OrderPlaceholder;
