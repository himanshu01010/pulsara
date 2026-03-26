export default function LightOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="light-orb orb-violet" />
      <div className="light-orb orb-amber" />
      <div className="light-orb orb-blue" />
      <div
        className="light-orb"
        style={{
          width: 300,
          height: 300,
          background: 'rgba(244, 114, 182, 0.05)',
          top: '70%',
          left: '10%',
          animation: 'float 16s ease-in-out infinite 5s',
          filter: 'blur(60px)',
        }}
      />
    </div>
  )
}