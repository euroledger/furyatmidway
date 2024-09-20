import "./dice3.css"

function LargeDie({name}) {
  return (
    <div className={name}>
      <div className="face front"></div>
      <div className="face back"></div>
      <div className="face top"></div>
      <div className="face bottom"></div>
      <div className="face right"></div>
      <div className="face left"></div>
    </div>
  )
}

export default LargeDie
