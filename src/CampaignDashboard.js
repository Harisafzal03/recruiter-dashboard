import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Sidebar } from "./Components/Sidebar";
import { QuestionFlow } from "./Components/QuestionFlow";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function CampaignDashboard() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-white">
                <div className="ml-6 w-3/4">
                    <div className="flex items-center justify-between px-32 pt-3">
                        {/* Title - Centered */}
                        <h1 className="text-lg font-semibold text-black">Campaign Dashboard</h1>
                        <span className="text-xs text-gray-500">Powered By Lyncit AI</span>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-between pr-32 pt-3">
                        {/* Left Section - Back Button */}
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        {/* Finalize Button */}
                        <button className="px-14 py-3 text-sm font-medium text-white bg-[rgb(122,86,144,1)] rounded-full hover:bg-[rgb(122,86,144,1)]">
                            Finalize the Campaign
                        </button>
                    </div>
                </div>

                <div className="flex">
                    <Sidebar />
                    <QuestionFlow />
                </div>
            </div>
        </DndProvider>
    );
}
