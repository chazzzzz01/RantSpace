import RantItem from "./RantItem";
import { Rant } from "../types";

interface RantListProps {
  rants: Rant[] | null | undefined;
}

export default function RantList({ rants }: RantListProps) {
  // Show an error if rants is not a valid array
  if (!Array.isArray(rants)) {
    return (
      <div className="text-red-500 text-sm p-4 bg-[#1a1a1a] rounded shadow">
        ⚠️ Unable to load rants. Please try again later.
      </div>
    );
  }

  // Handle empty rant array
  if (rants.length === 0) {
    return (
      <div className="text-gray-400 text-sm p-4 bg-[#1a1a1a] rounded shadow">
        💤 No rants yet. Be the first to rant!
      </div>
    );
  }

  return (
    <div
      className="
        flex 
        flex-col 
        gap-4 
        lg:flex-row 
        lg:flex-wrap 
        lg:gap-6 
        lg:items-start 
        w-full 
      "
      style={{ margin: 0, padding: 0 }}
    >
      {rants.map((rant) => (
        <div
          key={rant.id}
          className="
            w-full 
            lg:w-[calc(33.333%-1.5rem)] 
            max-w-full 
            bg-[#0f0f19] 
            rounded-md 
            p-4 
            shadow-[0_0_8px_rgba(57,255,20,0.3)] 
            transition 
            transform 
            hover:scale-[1.01]
          "
        >
          <RantItem rant={rant} />
        </div>
      ))}
    </div>
  );
}
