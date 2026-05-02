import { ClipLoader,ClimbingBoxLoader,HashLoader,BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="loader-overlay">
      <BeatLoader size={20} color="#FFFFFF" />
    </div>
  );
}
export default Loader