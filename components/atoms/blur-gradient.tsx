"use client"

export function TopBlurGradient() {
  return (
    <div className="pointer-events-none sticky inset-x-0 top-0 z-10 h-20">
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.1), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.2), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.3), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1.5px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.4), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 60%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(2px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.5), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 50%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(3px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.6), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 40%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 40%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(4px)",
          background: "linear-gradient(to bottom, hsl(var(--background) / 0.7), transparent)",
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 30%)",
          WebkitMask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 30%)",
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background to-transparent" />
    </div>
  )
}

export function BottomBlurGradient() {
  return (
    <div className="pointer-events-none sticky inset-x-0 bottom-0 z-10 h-36">
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.1), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.2), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(1px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.3), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(1.5px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.4), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 60%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(2px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 50%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(3px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.6), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 40%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 40%)",
        }}
      />
      <div
        className="absolute inset-0 bottom-16 z-10"
        style={{
          backdropFilter: "blur(4px)",
          background: "linear-gradient(to top, hsl(var(--background) / 0.7), transparent)",
          mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 30%)",
          WebkitMask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 30%)",
        }}
      />
      <div className="absolute inset-0 bottom-16 z-10 w-full bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-background" />
    </div>
  )
}
