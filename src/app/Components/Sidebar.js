import React from "react";
import { Card } from "../../components/ui/card";
import { DraggableQuestion } from "./DragableQuestion";

export function Sidebar() {
  return (
    <Card className="w-[350px] bg-[rgb(13,12,34)] p-6 h-[calc(80vh-2rem)] m-6 flex flex-col">
      <h2 className="font-semibold mb-4 text-lg text-white text-center">Drag and Drop Questions</h2>
      <hr className="mb-12 text-[#EAEAEA]"/>

      <div className="mb-4">
        <div className="space-y-3">
          <div className="bg-[#FDFDFD] text-black rounded-lg">
            <DraggableQuestion
              question={{
                id: "new_options",
                type: "options",
                title: "Options Based Question",
                options: [
                  { id: "opt1", text: "Option 1" },
                  { id: "opt2", text: "Option 2" },
                  { id: "opt3", text: "Option 3" },
                  { id: "opt4", text: "Option 4" }
                ]
              }}
              className="flex items-start hover:bg-transparent"
              icon={<svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2879 6.75H4.125C3.08947 6.75 2.25 5.91053 2.25 4.875C2.25 3.83947 3.08947 3 4.125 3H11.2879M6.71212 15H13.875C14.9105 15 15.75 14.1605 15.75 13.125C15.75 12.0895 14.9105 11.25 13.875 11.25H6.71212M2.25 13.125C2.25 14.5747 3.42525 15.75 4.875 15.75C6.32475 15.75 7.5 14.5747 7.5 13.125C7.5 11.6753 6.32475 10.5 4.875 10.5C3.42525 10.5 2.25 11.6753 2.25 13.125ZM15.75 4.875C15.75 6.32475 14.5747 7.5 13.125 7.5C11.6753 7.5 10.5 6.32475 10.5 4.875C10.5 3.42525 11.6753 2.25 13.125 2.25C14.5747 2.25 15.75 3.42525 15.75 4.875Z"
                  stroke="#3D3D4E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>}
            />
          </div>
          <div className="bg-[#FDFDFD] rounded-lg">
            <DraggableQuestion
              question={{
                id: "new_text",
                type: "text",
                title: "Text Based Question"
              }}
              className="flex items-start hover:bg-transparent"
              icon={<svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 5.25C3 4.55109 3 4.20163 3.11418 3.92597C3.26642 3.55843 3.55843 3.26642 3.92597 3.11418C4.20163 3 4.55109 3 5.25 3H12.75C13.4489 3 13.7984 3 14.074 3.11418C14.4416 3.26642 14.7336 3.55843 14.8858 3.92597C15 4.20163 15 4.55109 15 5.25M6.75 15H11.25M9 3V15"
                  stroke="#3D3D4E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>}
            />
          </div>

          <div className="bg-[#FDFDFD] rounded-lg">
            <DraggableQuestion
              question={{
                id: "new_end",
                type: "end",
                title: "End"
              }}
              className="flex items-start hover:bg-transparent"
              icon={<svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.125 11.25V6.75M10.875 11.25V6.75M5.85 15.75H12.15C13.4101 15.75 14.0402 15.75 14.5215 15.5048C14.9448 15.289 15.289 14.9448 15.5048 14.5215C15.75 14.0402 15.75 13.4101 15.75 12.15V5.85C15.75 4.58988 15.75 3.95982 15.5048 3.47852C15.289 3.05516 14.9448 2.71095 14.5215 2.49524C14.0402 2.25 13.4101 2.25 12.15 2.25H5.85C4.58988 2.25 3.95982 2.25 3.47852 2.49524C3.05516 2.71095 2.71095 3.05516 2.49524 3.47852C2.25 3.95982 2.25 4.58988 2.25 5.85V12.15C2.25 13.4101 2.25 14.0402 2.49524 14.5215C2.71095 14.9448 3.05516 15.289 3.47852 15.5048C3.95982 15.75 4.58988 15.75 5.85 15.75Z"
                  stroke="#3D3D4E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EAEAEA]">
        <div className="text-[#FDFDFD]">
        Drag, Drop and connect your question with simply picking up the question type and connecting it with the releavant response.
        </div>
      </div>
    </Card>
  );
}