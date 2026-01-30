import React, { useState, FormEvent } from 'react';
import { Copy, CheckCircle, ArrowDown, Eye } from 'lucide-react';
import { Reveal } from './Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Social } from './Social';

declare const emailjs: any;
declare const Toastify: any;

const CV_URL_DOWNLOAD = 'https://drive.google.com/uc?export=download&id=1NDAORzbytWDPnA-jtv_Avsv6vptplOvk';
const CV_URL_PREVIEW = 'https://drive.google.com/file/d/1NDAORzbytWDPnA-jtv_Avsv6vptplOvk/view?usp=sharing';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const email = "trungthongnguyen@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      Toastify({
        text: "Please fill in all fields",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      }).showToast();
      return;
    }

    setLoading(true);

    const params = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      await emailjs.send("service_8mk833q", "template_gbuspnd", params);
      
      setLoading(false);
      
      Toastify({
        text: "Email sent successfully!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending email:", error);
      setLoading(false);
      
      Toastify({
        text: "Error sending email! Please contact directly via phone or email.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      }).showToast();
    }
  };

  return (
    <section
      id="contact"
      className="py-40 px-6 bg-stone-100 text-stone-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.5em] opacity-40 block mb-12">
              Available for collaborations
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h2 className="text-6xl md:text-9xl font-bold mb-16 tracking-tighter">
              Let's build something <br /> remarkable.
            </h2>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="relative inline-block">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-white p-3 pr-4 rounded-full shadow-2xl shadow-stone-200/50 border border-white">
                <div className="px-8 py-2">
                  <a
                    href={`mailto:${email}`}
                    className="text-2xl md:text-4xl font-light hover:opacity-60 transition-opacity tracking-tight"
                  >
                    {email}
                  </a>
                </div>
                <button
                  aria-label="Copy Email Address"
                  onClick={handleCopy}
                  className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-105 hover:bg-black transition-all duration-300 group"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {/* Success Overlay Animation */}
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
                    animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
                    exit={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center bg-stone-900 text-white rounded-full z-20 pointer-events-none"
                  >
                    <span className="text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4">
                      COPIED!{" "}
                      <CheckCircle className="w-8 h-8 md:w-10 md:h-10 fill-white text-stone-900" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Contact Form Section */}
        <div className="grid md:grid-cols-2 gap-12 mt-32">
          <Reveal delay={0.6}>
            <div className="bg-gradient-to-br from-stone-900 to-stone-700 text-white shadow-xl rounded-[2rem] p-8 md:p-12">
              <h4 className="text-4xl font-bold mb-6">Thong Nguyen Trung</h4>
              <p className="leading-relaxed mb-8 opacity-90">
                I am a highly passionate software engineer. I am eager to contribute my skills and
                knowledge to your team. I am confident that my strong work ethic and dedication to
                learning will make me a valuable asset to your organization.
              </p>
              <h3 className="text-2xl font-bold mb-4">My CV</h3>
              <div className="flex gap-4">
                {/* Preview button */}
                <button
                  onClick={() => window.open(CV_URL_PREVIEW, '_blank')}
                  className="min-w-40 border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-stone-900 transition-all duration-300 text-sm uppercase tracking-widest flex items-center gap-3 font-medium"
                >
                  Preview
                  <Eye className="w-4 h-4" />
                </button>
                {/* Download button */}
                <button
                  onClick={() => window.open(CV_URL_DOWNLOAD)}
                  className="min-w-40 border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-stone-900 transition-all duration-300 text-sm uppercase tracking-widest flex items-center gap-3 font-medium"
                >
                  Download
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="bg-white shadow-xl rounded-[2rem] p-8 md:p-12">
              <h4 className="text-3xl font-bold mb-8 capitalize">Start our project</h4>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Name or Company's Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={8}
                    className="w-full px-6 py-4 rounded-xl border border-stone-200 focus:border-stone-900 focus:outline-none transition-colors resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 text-white px-8 py-4 rounded-full hover:bg-black transition-all duration-300 text-sm uppercase tracking-widest font-medium flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading && (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Send
                </button>
              </form>
            </div>
          </Reveal>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-12 text-left pt-20 border-t border-stone-200">
          <Reveal delay={0.8} className="h-full">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Location</p>
              <p className="text-lg">Ho Chi Minh City, Vietnam</p>
            </div>
          </Reveal>

          <Social />

          <Reveal delay={1.0} className="h-full">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Experience</p>
              <p className="text-lg">3+ Years in Tech</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: "XI3drcv-b1EjzbR25" });
}
