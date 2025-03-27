import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {/* Company Info */}
                <div>
                    <h2 className="text-xl font-semibold">AI Finance Manager</h2>
                    <p className="mt-2 text-gray-400">Your intelligent partner in managing finances efficiently.</p>
                </div>
                
                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-semibold">Quick Links</h2>
                    <ul className="mt-2 space-y-2">
                        <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                        <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                        <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                        <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                    </ul>
                </div>
                
                {/* Contact & Social Media */}
                <div>
                    <h2 className="text-xl font-semibold">Get in Touch</h2>
                    <p className="mt-2 text-gray-400">Email: support@aifinancemanager.com</p>
                    <p className="text-gray-400">Phone: +1 234 567 890</p>
                    <div className="mt-4 flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div className="text-center mt-6 border-t border-gray-700 pt-4 text-gray-400">
                &copy; 2025 AI Finance Manager. All rights reserved.
            </div>
        </footer>
    );
}
