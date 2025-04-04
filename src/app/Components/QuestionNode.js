import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, X, Edit } from "lucide-react";

export function QuestionNode({ data, isConnectable }) {
  const [options, setOptions] = useState(data.options || []);
  const [newOption, setNewOption] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedOptions, setEditedOptions] = useState(options.map(option => option.text));

  // Function to add a new option
  const addOption = () => {
    if (newOption.trim() !== "") {
      const newOptionObj = {
        id: `${data.id}_opt${options.length + 1}`,
        text: newOption.trim(),
      };
      setOptions([...options, newOptionObj]);
      setEditedOptions([...editedOptions, newOption.trim()]);
      setNewOption("");
      setShowInput(false);
    }
  };

  // Function to remove an option
  const removeOption = (id) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    setEditedOptions(updatedOptions.map(option => option.text)); // Update edited options as well
  };

  // Handle changes to the text of each option
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = value;
    setEditedOptions(updatedOptions);
  };

  // Save the edited question and options
  const saveEdit = () => {
    // Update the options in the parent component (or wherever needed)
    const updatedOptions = options.map((option, index) => ({
      ...option,
      text: editedOptions[index],
    }));
    setOptions(updatedOptions); // Save the updated options
    setIsEditing(false); // Exit edit mode for the question
  };

  return (
    <div className="relative rounded-xl border border-gray-300 shadow-sm p-4 bg-white w-[360px]">
      <Handle 
        type="target" 
        position={Position.Left} 
        isConnectable={isConnectable} 
        style={{
          top: "35%",
          left: "-6px",
        }}
      />

      {/* Question Title with Edit Icon */}
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            className="text-base font-medium text-gray-900 border border-gray-300 p-1 rounded"
          />
        ) : (
          <h3 className="font-medium text-gray-900 text-base">{editedTitle}</h3>
        )}
        <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700">
          <Edit className="h-4 w-4" />
        </button>
      </div>

      {/* Line under the question */}
      <div className="border-b border-gray-300 mb-4"></div>

      {data.type === "options" ? (
        <div className="space-y-2">
          <RadioGroup className="gap-2">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="relative flex items-center justify-between bg-white p-2 rounded-full border border-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} className="border-gray-400" />
                  {isEditing ? (
                    <Input
                      value={editedOptions[index]}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-grow text-sm border-gray-300 p-1 rounded"
                    />
                  ) : (
                    <Label htmlFor={option.id} className="text-gray-800">
                      {option.text}
                    </Label>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeOption(option.id)}>
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                  style={{
                    top: "-10px",
                    right: "-22px",
                  }}
                  isConnectable={isConnectable}
                />
              </div>
            ))}
          </RadioGroup>

          {/* Add Option Button */}
          {showInput ? (
            <div className="flex items-center space-x-2 p-2 border rounded-full bg-white">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Enter option"
                className="flex-grow text-sm"
              />
              <Button size="sm" onClick={addOption} className="bg-black text-white rounded-full px-3 py-1">
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-between p-2 border rounded-full bg-white shadow-sm"
            >
              Add Option <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : null}

      {/* Save Edited Question and Options */}
      {isEditing && (
        <div className="mt-4">
          <Button onClick={saveEdit} className="bg-black text-white rounded-full px-4 py-2">
            Save
          </Button>
        </div>
      )}
    </div>
  );
}