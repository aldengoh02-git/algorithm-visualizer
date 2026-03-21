// Controls renders the playback buttons and speed slider
// props:
//   isPlaying - boolean, whether the animation is auto-playing
//   onPlay - callback to start auto-play
//   onPause - callback to pause auto-play
//   onStepForward - callback to advance one step
//   onStepBack - callback to go back one step
//   onReset - callback to restart from step 0
//   onSpeedChange - callback when speed slider moves
//   speed - current speed value (1-5)
//   isFinished - boolean, whether we've reached the last step
export default function Controls({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  speed,
  isFinished
}) {
  return (
    <div className="flex flex-col items-center gap-4">

      {/* Playback buttons row */}
      <div className="flex items-center gap-3">

        {/* Reset button - goes back to step 0 */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg text-sm transition-colors"
        >
          ↺ Reset
        </button>

        {/* Step back button - go one step backwards */}
        <button
          onClick={onStepBack}
          disabled={isPlaying}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg text-sm transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Step
        </button>

        {/* Play/Pause button - toggles auto-play */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isFinished}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 
                     text-white rounded-lg text-sm font-medium 
                     transition-colors disabled:opacity-40 
                     disabled:cursor-not-allowed"
        >
          {/* Show Pause when playing, Play when paused, Done when finished */}
          {isPlaying ? '⏸ Pause' : isFinished ? '✓ Done' : '▶ Play'}
        </button>

        {/* Step forward button - go one step forward */}
        <button
          onClick={onStepForward}
          disabled={isPlaying || isFinished}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg text-sm transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Step →
        </button>

      </div>

      {/* Speed control slider */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Slow</span>
        <input
          type="range"
          min="1"
          max="5"
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="w-32 accent-blue-500"
        />
        <span>Fast</span>
      </div>

    </div>
  )
}