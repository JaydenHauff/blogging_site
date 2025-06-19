import SectionTitle from '@/components/ui/section-title';
import { ContactForm } from '@/components/forms/contact-form';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image'; // For placeholder map

export default function ContactPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Get in Touch"
          subtitle="We'd love to hear from you! Whether you have a question, feedback, or a collaboration idea, feel free to reach out."
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <TranslucentContainer 
            baseColor="card" 
            backgroundOpacity={70} 
            padding="p-8 md:p-10"
            className="h-full"
          >
            <h3 className="text-2xl font-headline font-semibold text-primary mb-6">Send us a message</h3>
            <ContactForm />
          </TranslucentContainer>

          <div className="space-y-8">
            <TranslucentContainer baseColor="card" backgroundOpacity={70} padding="p-8">
              <h3 className="text-2xl font-headline font-semibold text-primary mb-4">Contact Information</h3>
              <ul className="space-y-4 text-foreground/90">
                <li className="flex items-start">
                  <Mail className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Email:</span>
                    <a href="mailto:hello@museblog.com" className="block hover:text-accent transition-colors">hello@museblog.com</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Phone:</span>
                    <a href="tel:+1234567890" className="block hover:text-accent transition-colors">+1 (234) 567-890</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-6 w-6 text-accent mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Address:</span>
                    <p>123 Creative Lane, Inspiration City, USA</p>
                  </div>
                </li>
              </ul>
            </TranslucentContainer>
            
            {/* Placeholder for Google Maps embed */}
            <TranslucentContainer baseColor="card" backgroundOpacity={70} padding="p-0" className="overflow-hidden">
               <div className="relative w-full h-64 md:h-80">
                <Image 
                    src="https://placehold.co/600x400.png" // Replace with an actual map image or map API
                    alt="Map placeholder showing office location"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="city map"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <p className="text-white text-lg font-semibold p-4 bg-black/50 rounded">Map Area (Embed API Key Here)</p>
                </div>
              </div>
            </TranslucentContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
