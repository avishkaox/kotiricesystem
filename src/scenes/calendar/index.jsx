import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const FormDialog = ({ open, handleClose, addNewEvent }) => {
    const [title, setTitle] = useState("");

    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };

    const handleSubmit = () => {
      addNewEvent(title);
      handleClose();
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter a new title for your event
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="eventTitle"
            label="Event Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={handleTitleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add New Event</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const RemoveEventDialog = ({ open, handleClose, handleRemove }) => {
    const handleConfirmRemove = () => {
      handleRemove();
      handleClose();
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmRemove}>Delete</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleDateClick = (selected) => {
    setDialogOpen(true);
    setSelectedEvent(selected);
  };

  const addNewEvent = (title) => {
    const calendarApi = selectedEvent.view.calendar;
    calendarApi.unselect();

    calendarApi.addEvent({
      id: `${selectedEvent.dateStr} - ${title}`,
      title,
      start: selectedEvent.startStr,
      end: selectedEvent.endStr,
      allDay: selectedEvent.allDay,
      color: colors.primary.main,
    });
  };

  const handleEventClick = (selected) => {
    setSelectedEvent(selected.event);
    setRemoveDialogOpen(true);
  };

  const handleRemoveEvent = () => {
    selectedEvent.remove();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseRemoveDialog = () => {
    setRemoveDialogOpen(false);
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Full Calendar Interaction Page" />
      <Box display="flex" justifyContent="space-between">
        {/* Calendar side bar  */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Calendar side bar  */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin,listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            select={handleDateClick}
            dayMaxEvents={true}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            height="75vh"
          />
        </Box>
      </Box>
      <FormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        addNewEvent={addNewEvent}
      />
      <RemoveEventDialog
        open={removeDialogOpen}
        handleClose={handleCloseRemoveDialog}
        handleRemove={handleRemoveEvent}
      />
    </Box>
  );
};

export default Calendar;
