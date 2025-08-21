export const metadata = {
  title: "About — Jeremiah Miller",
  description: "About Jeremiah Miller, singer and songwriter.",
};

export default function AboutPage() {
  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Top section - Black hero area (larger proportion) */}
      <div className="h-[60%] bg-black flex items-center justify-center pt-16">
        <div className="text-center text-white px-8">
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto text-white/90">
            At Jeremiah Miller Music, we focus on building strong connections that drive growth 
            and opportunity. Through heartfelt performances, we identify and develop moments 
            with the potential for lasting success. By fostering key relationships and leveraging 
            musical insights, we maximize value and achieve sustainable results for our audiences.
          </p>
        </div>
      </div>

      {/* Bottom section - Split layout (smaller proportion) */}
      <div className="h-[40%] grid grid-cols-2">
        {/* Left: Real greyscale city image - more visible */}
        <div className="bg-gray-900 relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop&crop=center&auto=format&q=90"
            alt="City skyline"
            className="w-full h-full object-cover grayscale scale-110"
          />
        </div>

        {/* Right: Two square white text boxes */}
        <div className="bg-white grid grid-cols-2">
          {/* Left text box - TikTok */}
          <div className="bg-white p-6 flex flex-col justify-center border-r border-gray-100 group hover:bg-gray-800 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="flex items-start gap-3 transition-all duration-300 group-hover:translate-x-2">
              <div className="text-xl font-light text-black mt-1 transition-all duration-300 group-hover:text-white group-hover:scale-110">→</div>
              <div>
                <h3 className="text-lg font-medium text-black mb-2 tracking-wide transition-colors duration-300 group-hover:text-white">TikTok Presence</h3>
                <p className="text-gray-700 font-light leading-relaxed text-sm transition-colors duration-300 group-hover:text-gray-200">
                  Building a vibrant community on TikTok with authentic performances 
                  and behind-the-scenes content that resonates with fans.
                </p>
              </div>
            </div>
          </div>

          {/* Right text box - YouTube */}
          <div className="bg-white p-6 flex flex-col justify-center group hover:bg-gray-800 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="flex items-start gap-3 transition-all duration-300 group-hover:translate-x-2">
              <div className="text-xl font-light text-black mt-1 transition-all duration-300 group-hover:text-white group-hover:scale-110">→</div>
              <div>
                <h3 className="text-lg font-medium text-black mb-2 tracking-wide transition-colors duration-300 group-hover:text-white">YouTube Channel</h3>
                <p className="text-gray-700 font-light leading-relaxed text-sm transition-colors duration-300 group-hover:text-gray-200">
                  Sharing full performances and music videos on YouTube, 
                  connecting with audiences through longer-form content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}