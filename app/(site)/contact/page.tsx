export const metadata = {
  title: "Contact — Jeremiah Miller",
  description: "Invite Jeremiah to perform at your event.",
};

export default function ContactPage() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="h-full pt-20 px-6">
        {/* Main container - fits perfectly on screen */}
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left: Contact info and details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4 text-white">
                  Invite Jeremiah to Perform
                </h1>
                <p className="text-base text-gray-300 font-light leading-relaxed">
                  Book Jeremiah Miller for your next event, festival, or private gathering. 
                  Experience heartfelt performances that connect with audiences.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-white/80">&gt;</span>
                  <span className="text-gray-300 font-light text-sm">Street performances & festivals</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/80">&gt;</span>
                  <span className="text-gray-300 font-light text-sm">Private events & parties</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/80">&gt;</span>
                  <span className="text-gray-300 font-light text-sm">Corporate events & venues</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-400 font-light">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>
            </div>

            {/* Right: Compact contact form */}
            <div className="bg-white p-6 shadow-2xl">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-xs font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-xs font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Tell us about the event"
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-200 resize-none text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors duration-300 font-medium tracking-wide text-sm"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}