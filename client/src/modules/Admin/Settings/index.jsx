import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../../components/PageHeader.jsx";

export default function AdminSettings() {
  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Settings" />

      <Stack spacing={3} sx={{ mt: 2 }}>
        {/* System Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              System Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Email Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Send notifications via email
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Box>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Maintenance Mode
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Disable access for non-admin users
                  </Typography>
                </Box>
                <Switch />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Email Configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <TextField
                label="SMTP Server"
                placeholder="smtp.gmail.com"
                fullWidth
                size="small"
              />
              <TextField
                label="SMTP Port"
                placeholder="587"
                type="number"
                fullWidth
                size="small"
              />
              <TextField
                label="From Email"
                placeholder="noreply@campuscode.com"
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Save Changes</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Organization Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <TextField
                label="Organization Name"
                placeholder="Your College Name"
                fullWidth
                size="small"
              />
              <TextField
                label="Contact Email"
                placeholder="contact@college.com"
                fullWidth
                size="small"
              />
              <TextField
                label="Support Phone"
                placeholder="+91 XXXXXXXXXX"
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Save Changes</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
