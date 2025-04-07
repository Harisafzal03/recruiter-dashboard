import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, X, Edit } from "lucide-react";

export function QuestionNode({ data, isConnectable, id }) {
  const [options, setOptions] = useState(data.options || []);
  const [newOption, setNewOption] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedOptions, setEditedOptions] = useState(
    options.map((option) => option.text)
  );
  const [answerText, setAnswerText] = useState(data.answerText || "");
  const [endText, setEndText] = useState(data.endText || "");

  // Update local state when data props change
  useEffect(() => {
    setOptions(data.options || []);
    setEditedOptions((data.options || []).map((option) => option.text));
    setEditedTitle(data.title);
    setAnswerText(data.answerText || "");
    setEndText(data.endText || "");
  }, [data]);

  const updateNodeData = (newData) => {
    if (data.updateNodeData) {
      data.updateNodeData(id, newData);
    }
  };

  const addOption = () => {
    if (newOption.trim() !== "") {
      const newOptionObj = {
        id: `${data.id}_opt${options.length + 1}`,
        text: newOption.trim()
      };
      const updatedOptions = [...options, newOptionObj];
      setOptions(updatedOptions);
      setEditedOptions([...editedOptions, newOption.trim()]);
      setNewOption("");
      setShowInput(false);
      
      // Update parent component
      updateNodeData({ options: updatedOptions });
    }
  };

  const removeOption = (id) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
    setEditedOptions(updatedOptions.map((option) => option.text));
    
    // Update parent component
    updateNodeData({ options: updatedOptions });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = value;
    setEditedOptions(updatedOptions);
  };

  const saveEdit = () => {
    // Update the title
    const updatedTitle = editedTitle;
    
    // Update the options
    const updatedOptions = options.map((option, index) => ({
      ...option,
      text: editedOptions[index]
    }));
    setOptions(updatedOptions);
    
    // Update text content based on node type
    let updates = { 
      title: updatedTitle,
      options: updatedOptions
    };
    
    if (data.type === "text") {
      updates.answerText = answerText;
    } else if (data.type === "end") {
      updates.endText = endText;
    }
    
    // Update parent component
    updateNodeData(updates);
    
    setIsEditing(false);
  };

  const saveEndEdit = () => {
    updateNodeData({ 
      endText: endText,
      title: editedTitle
    });
    setIsEditing(false);
  };

  if (data.type === "end") {
    return (
      <div className="relative rounded-xl border border-gray-300 shadow-sm p-4 bg-white w-[360px]">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{
            top: "50%",
            left: "-6px"
          }}
        />

        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700 flex w-full justify-end"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>

        <textarea
          value={endText}
          onChange={(e) => setEndText(e.target.value)}
          placeholder="Enter your final message here..."
          className="w-full h-32 border border-gray-300 rounded-md p-2 text-gray-700 resize-none"
          disabled={!isEditing}
        />

        {isEditing && (
          <div className="mt-4">
            <Button
              onClick={saveEndEdit}
              className="bg-black text-white rounded-full px-4 py-2"
            >
              Save
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-gray-300 shadow-sm p-4 bg-white w-[360px]">
      {/* Only render the input handle if it's not the first options question (when isFirstNode is false) 
          or if it's not an options type question */}
      {(data.type !== "options" || !data.isFirstNode) && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{
            top: "35%",
            left: "-6px"
          }}
        />
      )}

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
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>

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
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="border-gray-400"
                  />
                  {isEditing ? (
                    <Input
                      value={editedOptions[index]}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-grow text-sm border-gray-300 p-1 rounded"
                    />
                  ) : (
                    <Label htmlFor={option.id} className="text-gray-800">
                      {option.text}
                    </Label>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  disabled={!isEditing && options.length <= 1}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                  style={{
                    top: "50%",
                    right: "-6px"
                  }}
                  isConnectable={isConnectable}
                />
              </div>
            ))}
          </RadioGroup>

          {showInput ? (
            <div className="flex items-center space-x-2 p-2 border rounded-full bg-white">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Enter option"
                className="flex-grow text-sm"
              />
              <Button
                size="sm"
                onClick={addOption}
                className="bg-black text-white rounded-full px-3 py-1"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInput(false)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-between p-2 border rounded-full bg-white shadow-sm"
              disabled={!isEditing}
            >
              Add Option <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : data.type === "text" ? (
        <div className="space-y-3">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter your answer here..."
            className="w-full h-24 border border-gray-300 rounded-md p-2 text-gray-700"
            disabled={!isEditing}
          />

          <Handle
            type="source"
            position={Position.Right}
            id="text-output"
            style={{
              bottom: "50%",
              right: "-6px"
            }}
            isConnectable={isConnectable}
          />
        </div>
      ) : null}

      {isEditing && (
        <div className="mt-4">
          <Button
            onClick={saveEdit}
            className="bg-black text-white rounded-full px-4 py-2"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}