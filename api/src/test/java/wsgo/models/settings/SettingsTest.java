package wsgo.models.settings;

import org.junit.Test;
import wsgo.utils.EndpointTestCase;

import static org.junit.Assert.assertEquals;

public class SettingsTest extends EndpointTestCase {

    @Test
    public void testList() {
        String json = get("/settings");
        assertEquals("[]", json);
    }

}
