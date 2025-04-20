"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Check, Filter, Loader2, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

type Allergy = {
  id: number;
  allergy_type: string;
};

type MenuFilterProps = {
  setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
};

const MenuFilter: React.FC<MenuFilterProps> = ({ setAllergies }) => {
  // State management
  const [allergyOptions, setAllergyOptions] = useState<Allergy[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch allergies from API
  useEffect(() => {
    const fetchAllergies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use environment variable for API URL (fallback to localhost for development)
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.get(`${apiUrl}/api/allergies`);
        setAllergyOptions(response.data);
      } catch (err) {
        console.error("Failed to fetch allergies", err);
        setError("Failed to load allergies. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllergies();
  }, []);

  // Update parent component when selections change
  useEffect(() => {
    setAllergies(selectedAllergies.map((id) => id.toString()));
  }, [selectedAllergies, setAllergies]);

  // Toggle selection of an allergy
  const toggleAllergy = (id: number) => {
    setSelectedAllergies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Clear all selected allergies
  const clearAllSelections = () => {
    setSelectedAllergies([]);
  };

  // Get allergy name by ID
  const getAllergyName = (id: number): string => {
    const allergy = allergyOptions.find((a) => a.id === id);
    return allergy ? allergy.allergy_type : "";
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter Allergies
            {selectedAllergies.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedAllergies.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        {/* Filter Content */}
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Exclude Allergies</h3>
              {selectedAllergies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllSelections}
                  className="h-8 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Selected allergies display */}
            {selectedAllergies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedAllergies.map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getAllergyName(id)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Command menu for selection */}
          <Command>
            <CommandInput placeholder="Search allergies..." />
            <CommandList className="max-h-60">
              <CommandEmpty>No allergies found.</CommandEmpty>

              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading allergies...
                </div>
              ) : error ? (
                <div className="p-4 text-sm text-red-500">{error}</div>
              ) : (
                <CommandGroup>
                  {allergyOptions.map((allergy) => (
                    <CommandItem
                      key={allergy.id}
                      onSelect={() => toggleAllergy(allergy.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{allergy.allergy_type}</span>
                      {selectedAllergies.includes(allergy.id) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>

          <Separator />

          {/* Action buttons */}
          <div className="p-2 flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MenuFilter;
