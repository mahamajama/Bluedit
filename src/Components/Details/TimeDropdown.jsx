import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

import SortDropdown from "./SortDropdown";

export default function TimeDropdown() {

    const options = {
        all: 'All Time',
        day: '24 Hours',
        week: 'Past Week',
        month: 'Past Month',
        year: 'Past Year',
    }

    return (
        <SortDropdown name="Time" param="t" options={options} />
    );
}