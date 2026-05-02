import { ClipLoader,ClimbingBoxLoader,HashLoader,BeatLoader } from "react-spinners";

function LoaderSpecific({size,classNameProp}) {
  return (
    <div className={`loader-specific ${classNameProp}`}>
      <BeatLoader size={size} color="#FFFFFF" />
    </div>
  );
}
export default LoaderSpecific