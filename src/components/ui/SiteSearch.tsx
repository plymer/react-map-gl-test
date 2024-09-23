import { Input } from "./Input";
import Button from "./Button";
import { Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useState } from "react";

const SiteSearch = () => {
  // store the user form input as they type
  const [searchParam, setSearchParam] = useState<string>();
  // store the submitted user input once they hit the search button
  const [siteID, setSiteID] = useState<string>();

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
            placeholder="3- or 4-letter ID"
            className="text-center uppercase"
            spellCheck={false}
            maxLength={4}
            minLength={3}
            onChange={(e) => setSearchParam(e.target.value)}
          ></Input>
          <Button
            className="ms-2"
            onClick={() => {
              setSiteID(searchParam), console.log(siteID);
            }}
          >
            Search
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SiteSearch;
