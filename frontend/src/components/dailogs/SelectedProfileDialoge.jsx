// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Avatar, AvatarImage } from "../ui/avatar";

// const ProfileDialogSelected = ({ user }) => {
//   return (
//     <div>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Avatar className=" w-[50px] h-[50px] cursor-pointer">
//             <AvatarImage src={user.pic} />
//           </Avatar>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <div className="flex flex-col items-center gap-5">
//               <DialogTitle>
//                 <Avatar className=" w-[180px] h-[180px] cursor-pointer">
//                   <AvatarImage src={user.pic} />
//                 </Avatar>
//               </DialogTitle>
//               {""}
//               <DialogTitle className="text-3xl">{user.name}</DialogTitle>
//             </div>
//             <DialogDescription className="text-2xl">
//               Email : {user.email}
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProfileDialogSelected;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "../ui/avatar";

const ProfileDialogSelected = ({ user }) => {
  return (
    <div>
      <Dialog>
        {/* ✅ Using asChild to avoid nested <button> issue */}
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <Avatar className="w-[43px] h-[43px]">
              <AvatarImage src={user.pic} />
            </Avatar>
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center gap-5">
              <Avatar className="w-[180px] h-[180px]">
                <AvatarImage src={user.pic} />
              </Avatar>
              <DialogTitle className="text-3xl">{user.name}</DialogTitle>
            </div>
            <DialogDescription className="text-2xl">
              Email: {user.email}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDialogSelected;
