import React from "react";
import { Card } from "../../components/ui/card";
import { Type, ListChecks, Square } from "lucide-react";
import { DraggableQuestion } from "./DragableQuestion";
import { InitialQuestion } from "../Data/InitialQuestion";

export function Sidebar() {
  return (
    <Card className="w-64 bg-[rgb(13,12,34)] text-white p-6 h-[calc(80vh-2rem)] m-6 flex flex-col">
      <h2 className="font-semibold mb-4">Drag and Drop Questions</h2>

      <div className="flex-grow overflow-y-auto space-y-2">
        {InitialQuestion.map((question) => (
          <DraggableQuestion
            key={question.id}
            question={question}
            className="hover:bg-white hover:text-black"
            icon={question.type === "text" ? <Type className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
          />
        ))}

        <DraggableQuestion
          question={{
            id: "end",
            type: "end",
            title: "End",
          }}
          className="hover:bg-white hover:text-black"
          icon={<Square className="h-4 w-4" />}
        />
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-400">
          Drag, Drop and connect your question with simply picking up the question type and connecting it with the
          relevant response.
        </div>
      </div>
    </Card>
  );
}