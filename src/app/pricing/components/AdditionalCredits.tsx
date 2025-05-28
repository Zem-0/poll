"use client";
import React from "react";
import {
  Card,
  Typography,
  FormControl,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const AdditionalCredits = () => {
  const [credits, setCredits] = React.useState("");

  return (
    <section className="w-full py-14 px-4">
      <Card className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 p-8 rounded-3xl shadow-xl">
        {/* Info Block */}
        <div className="md:w-[70%]">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Need additional credits?
          </Typography>
          <Typography variant="body1" className="text-gray-700 mb-4">
            You can use credits to scale up your surveys and interviews easily
            and affordably. Here’s what <strong>100 credits</strong> can do for
            you:
          </Typography>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>100 × 10 min fully dynamic survey responses</li>
            <li>4 × 30 min conversational interviews</li>
            <li>2 × 30 min advanced conversational interviews</li>
            <li>100 custom insights from your AI copilot</li>
          </ul>
        </div>

        {/* Selection + Action */}
        <div className="md:w-[30%] flex flex-col justify-center gap-6">
          <FormControl fullWidth size="small">
            <InputLabel id="credits-label">Select credits</InputLabel>
            <Select
              labelId="credits-label"
              id="credits"
              value={credits}
              label="Select credits"
              onChange={(e) => setCredits(e.target.value)}
              displayEmpty
            >
              <MenuItem value="100">100 Credits</MenuItem>
              <MenuItem value="200">200 Credits</MenuItem>
              <MenuItem value="500">500 Credits</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="medium"
            disabled={!credits}
            className={`transition-all duration-300 ease-in-out transform hover:scale-[1.03] active:scale-[0.98] 
              bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold p-3 rounded-md shadow-md 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Purchase Credits
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default AdditionalCredits;
