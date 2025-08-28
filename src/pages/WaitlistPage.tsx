import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const WaitlistPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use our backend Tally service endpoint
      const response = await fetch('/api/tally-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          feedback: feedback.trim() || undefined,
          source: 'waitlist_page'
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setIsSubmitted(true);
        toast({
          title: "Thank you!",
          description: result.message || "You've been added to our waitlist. We'll be in touch soon!",
        });
      } else {
        throw new Error(result.error || 'Failed to submit');
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Error",
        description: "Sorry, there was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center bg-card border-border">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">You're on the list!</h1>
            <p className="text-muted-foreground">
              Thanks for your interest. We'll notify you when we launch.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 bg-card border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Join the Waitlist</h1>
          <p className="text-muted-foreground">
            Be the first to know when our collaborative AI ideation tool launches
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-foreground font-medium">
              Feedback or Questions
            </Label>
            <Textarea
              id="feedback"
              placeholder="What features would you like to see? Any thoughts about the tutorial?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-20"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Join Waitlist"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. No spam, just updates about our launch.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WaitlistPage;