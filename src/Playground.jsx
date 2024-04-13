/* eslint-disable react/prop-types */
import * as React from "react";

const Playground = () => {
  const [isPress, setPress] = React.useState(false);
  const handleSetPress = () => setPress(!isPress);
  return (
    <>
      <Button onClick={handleSetPress}>Toggle</Button>
      {isPress && <div>Hu oa`</div>}
    </>
  );
};

const Button = ({ onClick, children }) => (
  <>
    <button type="button" onClick={onClick}>
      {children}
    </button>
  </>
);

export default Playground;
