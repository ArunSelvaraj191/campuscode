import { Avatar, Paper, Stack, Typography } from "@mui/material";

const PageHeader = ({
  title,
  subtitle,
  userName = "Prof. Lee",
  userInitials = "PL",
  avatarBgColor = "grey.100",
  showUserInfo = false,
}) => {
  return (
    <>
      {/* Top Header with User Info */}
      {showUserInfo ? (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 3,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(15,23,42,0.04)",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 0.5,
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Hi, {userName}
            </Typography>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: avatarBgColor,
                color: "text.primary",
              }}
            >
              {userInitials}
            </Avatar>
          </Stack>
        </Paper>
      ) : (
        <>
          {/* Title and Subtitle */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 0.5,
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default PageHeader;
