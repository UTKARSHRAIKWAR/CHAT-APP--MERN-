import { X } from "lucide-react";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="w-fit flex justify-between px-2 py-1 rounded-lg m-1 mb-2 text-[12px] bg-purple-600 text-white hover:bg-purple-700 cursor-pointer "
    >
      {user.name}
      <X />
    </div>
  );
};

export default UserBadge;
