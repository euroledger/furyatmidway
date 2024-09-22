function DamageMarker() {
  const createImage = (image, left, top) => {
    return (
      <img
        src={image}
        style={{
          width: "40px",
          height: "40px",
          position: "absolute",
          top: top,
          left: left,
        }}
      ></img>
    )
  }
}

export default DamageMarker
