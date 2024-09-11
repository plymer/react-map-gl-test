import { Input } from "./Input";
import Button from "./Button";
import { Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

const SiteSearch = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button className="p-3">
            <Search />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="ms-4 inline-flex rounded-md border-black bg-gray-800 p-2"
          side="right"
        >
          <Input
            type="text"
            placeholder=""
            className="text-center uppercase"
            spellCheck={false}
          ></Input>
          <Button className="ms-2">Search</Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SiteSearch;
