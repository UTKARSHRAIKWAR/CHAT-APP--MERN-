import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
const UserListing = ({ user, handleFunction }) => {
  // const { user } = ChatState();
  return (
    <div
      onClick={handleFunction}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-[#E8E8E8] hover:bg-[#38B2AC] transition w-full mb-2 px-3 py-2"
    >
      <Avatar>
        <AvatarImage src={user.pic} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>

      <div>
        <h2>{user.name}</h2>
        <p>
          {" "}
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListing;
