type GridBgOptions = {
	gap?: string; // e.g., '5em', '40px'
	line?: string; // e.g., '1px'
	color?: string; // e.g., 'rgba(255,255,255,0.2)'
};

export const makeGridBgStyle = (opts: GridBgOptions = {}): React.CSSProperties => {
	const { gap = "5em", line = "1px", color = "rgba(255, 255, 255, 0.2)" } = opts;

	return {
		["--gap" as any]: gap,
		["--line" as any]: line,
		["--color" as any]: color,
		backgroundImage: `
      linear-gradient(
        -90deg,
        transparent calc(var(--gap) - var(--line)),
        var(--color) calc(var(--gap) - var(--line) + 1px),
        var(--color) var(--gap)
      ),
      linear-gradient(
        0deg,
        transparent calc(var(--gap) - var(--line)),
        var(--color) calc(var(--gap) - var(--line) + 1px),
        var(--color) var(--gap)
      )
    `,
		backgroundSize: "var(--gap) var(--gap)",
	} as React.CSSProperties;
};
