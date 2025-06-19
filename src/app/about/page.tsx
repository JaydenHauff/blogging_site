import SectionTitle from '@/components/ui/section-title';
import TeamMemberCard from '@/components/about/team-member-card';
import { MOCK_TEAM_MEMBERS, SITE_NAME } from '@/lib/constants';
import TranslucentContainer from '@/components/ui/translucent-container';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title={`About ${SITE_NAME}`} 
          subtitle="Learn more about our mission, vision, and the passionate team behind our creative content." 
        />

        <TranslucentContainer 
          className="mb-16 md:mb-24"
          baseColor="card"
          backgroundOpacity={60}
          padding="p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-3xl font-headline font-semibold text-primary mb-4">Our Mission</h3>
              <p className="text-lg text-foreground/90 mb-4">
                At {SITE_NAME}, we believe in the power of words to inspire, educate, and connect. Our mission is to provide a vibrant platform for diverse voices and compelling stories that spark curiosity and foster understanding.
              </p>
              <p className="text-lg text-foreground/90">
                We are dedicated to curating high-quality content that engages readers, encourages critical thinking, and celebrates the art of creative expression in all its forms.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Inspirational image for mission" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="team collaboration"
              />
            </div>
          </div>
        </TranslucentContainer>

        <SectionTitle title="Meet the Team" subtitle="The dedicated individuals who bring MuseBlog to life." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
