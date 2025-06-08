import { UsersTable } from "@/components/contents/users-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <Tabs defaultValue="traveler">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="traveler">Traveler</TabsTrigger>
          <TabsTrigger value="tourguide">Tour Guide</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="traveler">
        <UsersTable userRole="traveler" />
      </TabsContent>
      <TabsContent value="tourguide">
        <UsersTable userRole="tourguide" />
      </TabsContent>
    </Tabs>
  );
}