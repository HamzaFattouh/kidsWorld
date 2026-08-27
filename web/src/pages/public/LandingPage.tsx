import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ScrollyVideo } from '../../components/ui/ScrollyVideo';
import { Heart, Shield, BookOpen } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 w-full h-full z-0">
          <ScrollyVideo 
            videoSrc="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            heightClass="h-[150vh]"
            className="opacity-50"
          />
        </div>
        
        <div className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-text dark:text-text-dark tracking-tight">
            Where Every Child <span className="text-primary">Blossoms</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted dark:text-text-mutedDark">
            A nurturing environment blending education, creativity, and play to build the foundation of your child's future.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg">Enroll Now</Button>
            <Button size="lg" variant="outline">Book a Tour</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-text dark:text-text-dark">Our Mission & Values</h2>
          <p className="max-w-2xl mx-auto text-text-muted dark:text-text-mutedDark">
            We believe in fostering curiosity, empathy, and resilience in every child through a holistic approach to early education.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg bg-surface dark:bg-surface-dark hover:-translate-y-1 transition-transform">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Nurturing Care</h3>
              <p className="text-text-muted dark:text-text-mutedDark text-sm">Providing a safe and loving environment where children feel completely at home.</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-surface dark:bg-surface-dark hover:-translate-y-1 transition-transform">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Holistic Learning</h3>
              <p className="text-text-muted dark:text-text-mutedDark text-sm">Engaging activities that develop cognitive, social, and motor skills.</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg bg-surface dark:bg-surface-dark hover:-translate-y-1 transition-transform">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Total Security</h3>
              <p className="text-text-muted dark:text-text-mutedDark text-sm">State-of-the-art facilities and strict protocols to ensure your child's safety.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CMS Data Stubs */}
      <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text dark:text-text-dark">Life at KidsWorld</h2>
            <p className="text-text-muted dark:text-text-mutedDark mt-2">A glimpse into our daily adventures</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stubs */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center text-text-muted">
                Image {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-text dark:text-text-dark">Upcoming Events</h2>
            <p className="text-text-muted dark:text-text-mutedDark mt-2">Join us for our special activities</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-800" />
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-primary mb-2">October {10 + i}, 2026</div>
                <h3 className="text-xl font-bold mb-2">Autumn Festival Event {i}</h3>
                <p className="text-text-muted dark:text-text-mutedDark text-sm mb-4">
                  Join us for a fun-filled day of crafts, games, and seasonal celebrations.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-primary/10 dark:bg-primary/20 text-center px-4">
        <h2 className="text-3xl font-bold text-text dark:text-text-dark mb-6">Ready to Join Our Family?</h2>
        <p className="text-lg text-text-muted dark:text-text-mutedDark max-w-2xl mx-auto mb-8">
          Contact us today to schedule a personalized tour of our facilities and meet our wonderful staff.
        </p>
        <Button size="lg">Contact Us</Button>
      </section>
    </div>
  );
}
