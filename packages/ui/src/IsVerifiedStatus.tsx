export const IsVerifiedStatus = ({ isVerified = false }) => {
  return isVerified ? (
    <p>Verified</p>
  ) : (
    <p className="color-red">Not Verified</p>
  );
};

export default IsVerifiedStatus;
