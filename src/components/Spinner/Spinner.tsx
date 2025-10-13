import "./Spinner.css"

export default function Spinner() {
  return (
    <div className="spinnerContainer">
      <div className="spinner"></div>
      <p className="spinnerText">Cargando clima...</p>
    </div>
  )
}
