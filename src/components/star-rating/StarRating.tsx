import { JSX, useState } from "react";

interface StarRatingProps {
  title: string;
  rating: number | null;
  readOnly?: boolean;
  onRatingChanged?: (rating: number) => void;
}

export default function StarRating({
  rating,
  readOnly,
  onRatingChanged,
  title,
}: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState<number | null>(rating);
  const handleRatingChanged = (rating: number) => {
    if (rating === currentRating && !readOnly) {
      return;
    }

    if (rating < 0) {
      setCurrentRating(null);
    } else {
      setCurrentRating(rating);
    }
    onRatingChanged?.(rating);
  };
  return (
    <div>
      <span className="font-bold mr-2">{title}:</span>
      {...renderStarRating(currentRating, readOnly, handleRatingChanged)}
      {!readOnly && rating && (
        <button
          className="text-sm text-red-600 ml-2"
          onClick={() => handleRatingChanged(-1)}
        >
          Clear
        </button>
      )}
    </div>
  );
}

function renderStarRating(
  currentRating: number | null,
  readOnly: boolean | null | undefined,
  handleRatingChanged: (rating: number) => void
): JSX.Element[] {
  if (readOnly && currentRating === null) {
    return [<span>No rating</span>];
  }
  const elements = Array.from({ length: 5 }, (_, i) => (
    <span
      className={`${
        !readOnly && "hover:cursor-pointer"
      } text-yellow-600 text-xl`}
      key={i}
      onClick={() => !readOnly && handleRatingChanged(i + 1)}
    >
      {currentRating && i + 1 <= currentRating ? "★" : "☆"}
    </span>
  ));
  return elements;
}
